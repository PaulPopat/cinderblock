namespace Binary
{
  class Instruction
  {
  public:
    static Instruction *Parse(char *binary, int offset);
    virtual const int get_end() const = 0;
  };
}