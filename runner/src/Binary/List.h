namespace Binary
{
  template <typename T>
  class List
  {
  public:
    List();

    void push(T input);
    unsigned int &get_length() const;
    T get_item(unsigned int &index) const;

  private:
    T *data;
    unsigned int length;
    unsigned int mem_length;
  };
}